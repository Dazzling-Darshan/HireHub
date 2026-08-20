import { Application } from "../models/application.model.js";
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

// APPLY JOB
const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already applied",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    // Invalidate applied jobs for user, applicant list for job, and single job detail
    await Promise.all([
      deleteKeysByPattern(`applications:user:${userId}:*`),
      deleteKeysByPattern(`applications:job:${jobId}:*`),
      deleteCache(`jobs:detail:${jobId}`),
    ]);

    return res.status(201).json({
      message: "Job applied successfully",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// GET APPLIED JOBS
const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const { page, limit, skip } = getPaginationParams(req, 7);

    const cacheKey = `applications:user:${userId}:${page}:${limit}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const query = { applicant: userId };

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "job",
          populate: {
            path: "company",
          },
        }),
      Application.countDocuments(query),
    ]);

    const responsePayload = {
      success: true,
      applications,
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

// GET APPLICANTS FOR A JOB
const getApplicant = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { page, limit, skip } = getPaginationParams(req, 10);

    const cacheKey = `applications:job:${jobId}:${page}:${limit}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const job = await Job.findById(jobId).populate({ path: "company" });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const [applications, total, statusCounts] = await Promise.all([
      Application.find({ job: jobId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "applicant" }),
      Application.countDocuments({ job: jobId }),
      Application.aggregate([
        { $match: { job: job._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const stats = { total: 0, accepted: 0, rejected: 0, pending: 0 };
    statusCounts.forEach(({ _id, count }) => {
      stats.total += count;
      if (_id === "accepted") stats.accepted = count;
      else if (_id === "rejected") stats.rejected = count;
      else if (_id === "pending") stats.pending = count;
    });

    const responsePayload = {
      success: true,
      job: {
        ...job.toObject(),
        applications,
      },
      stats,
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

// UPDATE STATUS
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const validStatus = ["pending", "accepted", "rejected"];

    if (!status || !validStatus.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    // Invalidate applicant list for job, user's applications, and job details
    await Promise.all([
      deleteKeysByPattern(`applications:job:${application.job}:*`),
      deleteKeysByPattern(`applications:user:${application.applicant}:*`),
      deleteCache(`jobs:detail:${application.job}`),
    ]);

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
      application,
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
  applyJob,
  getAppliedJobs,
  getApplicant,
  updateStatus,
};