import { Job } from "../models/job.model.js";
import {
  getPaginationParams,
  buildPaginationResponse,
} from "../utils/pagination.js";
import {
  getCache,
  setCache,
  deleteCache,
  deleteKeysByPattern,
  CACHE_TTL,
} from "../utils/redis.js";

// CREATE JOB
const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      expiryDate,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experience,
      position,
      company: companyId,
      createdBy: userId,
      ...(expiryDate && { expiryDate: new Date(expiryDate) }),
    });

    // Invalidate cached job listings
    await Promise.all([
      deleteKeysByPattern("jobs:all:*"),
      deleteKeysByPattern(`jobs:admin:${userId}:*`),
    ]);

    return res.status(201).json({
      message: "New Job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      expiryDate,
    } = req.body;

    const userId = req.id;

    let job = await Job.findOne({ _id: jobId, createdBy: userId });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to edit it",
        success: false,
      });
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements.split(",");
    if (salary) job.salary = Number(salary);
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experience) job.experience = experience;
    if (position) job.position = Number(position);
    if (expiryDate) job.expiryDate = new Date(expiryDate);

    await job.save();

    // Invalidate cached job data
    await Promise.all([
      deleteCache(`jobs:detail:${jobId}`),
      deleteKeysByPattern("jobs:all:*"),
      deleteKeysByPattern(`jobs:admin:${userId}:*`),
    ]);

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// GET ALL JOBS
const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const jobType = req.query.jobType || "";
    const minSalary = req.query.minSalary ? Number(req.query.minSalary) : null;
    const maxSalary = req.query.maxSalary ? Number(req.query.maxSalary) : null;
    const experience = req.query.experience ? Number(req.query.experience) : null;
    const hasPagination =
      req.query.page !== undefined || req.query.limit !== undefined;
    const { page, limit, skip } = getPaginationParams(req, 9);

    const cacheKey = `jobs:all:${keyword}:${location}:${jobType}:${minSalary || 0}-${maxSalary || "max"}:${experience || "any"}:${hasPagination ? `${page}:${limit}` : "all"}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    if (experience !== null && !isNaN(experience)) {
      query.experience = { $lte: experience };
    }

    if ((minSalary !== null && !isNaN(minSalary)) || (maxSalary !== null && !isNaN(maxSalary))) {
      query.salary = {};
      if (minSalary !== null && !isNaN(minSalary)) query.salary.$gte = minSalary;
      if (maxSalary !== null && !isNaN(maxSalary)) query.salary.$lte = maxSalary;
    }

    if (!hasPagination) {
      const jobs = await Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 });

      const responsePayload = {
        jobs,
        success: true,
      };

      await setCache(cacheKey, responsePayload, CACHE_TTL.MEDIUM);

      return res.status(200).json(responsePayload);
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query),
    ]);

    const responsePayload = {
      jobs,
      pagination: buildPaginationResponse(page, limit, total),
      success: true,
    };

    await setCache(cacheKey, responsePayload, CACHE_TTL.MEDIUM);

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// GET JOB BY ID
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const cacheKey = `jobs:detail:${jobId}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "No job found",
        success: false,
      });
    }

    const responsePayload = {
      message: "Job found successfully",
      success: true,
      job,
    };

    await setCache(cacheKey, responsePayload, CACHE_TTL.LONG);

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// GET ADMIN JOBS
const getAdminJobs = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { page, limit, skip } = getPaginationParams(req, 10);
    const keyword = req.query.keyword || "";

    const cacheKey = `jobs:admin:${recruiterId}:${keyword}:${page}:${limit}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const query = { createdBy: recruiterId };
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query),
    ]);

    const responsePayload = {
      message: total === 0 ? "No jobs found" : "Jobs found",
      success: true,
      jobs,
      pagination: buildPaginationResponse(page, limit, total),
    };

    await setCache(cacheKey, responsePayload, CACHE_TTL.SHORT);

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export default {
  postJob,
  updateJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
};