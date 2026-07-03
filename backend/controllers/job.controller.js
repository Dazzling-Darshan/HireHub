import { Job } from "../models/job.model.js";
import {
  getPaginationParams,
  buildPaginationResponse,
} from "../utils/pagination.js";

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
    const hasPagination =
      req.query.page !== undefined || req.query.limit !== undefined;

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    if (!hasPagination) {
      const jobs = await Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        jobs,
        success: true,
      });
    }

    const { page, limit, skip } = getPaginationParams(req, 9);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      jobs,
      pagination: buildPaginationResponse(page, limit, total),
      success: true,
    });
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

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant"
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "No job found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job found successfully",
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

// GET ADMIN JOBS
const getAdminJobs = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { page, limit, skip } = getPaginationParams(req, 10);
    const keyword = req.query.keyword || "";

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

    return res.status(200).json({
      message: total === 0 ? "No jobs found" : "Jobs found",
      success: true,
      jobs,
      pagination: buildPaginationResponse(page, limit, total),
    });
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