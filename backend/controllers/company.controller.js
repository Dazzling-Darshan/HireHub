import { Company } from '../models/company.model.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
import {
    getPaginationParams,
    buildPaginationResponse,
} from '../utils/pagination.js';
import {
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern,
    CACHE_TTL,
} from '../utils/redis.js';

// REGISTER COMPANY
const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        const userId = req.id;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });

        if (company) {
            return res.status(400).json({
                message: "Company already exists with this name",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            createdBy: userId,
        });

        // Invalidate cached company lists for this user
        await deleteKeysByPattern(`companies:user:${userId}:*`);

        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
            company
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Company registration failed",
            success: false
        });
    }
};


// GET ALL COMPANIES OF USER
const getCompanies = async (req, res) => {
    try {
        const userId = req.id;
        const hasPagination =
            req.query.page !== undefined || req.query.limit !== undefined;
        const keyword = req.query.keyword || "";
        const { page, limit, skip } = getPaginationParams(req, 10);

        const cacheKey = `companies:user:${userId}:${keyword}:${hasPagination ? `${page}:${limit}` : "all"}`;
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const query = {
            $or: [{ createdBy: userId }, { created_by: userId }],
        };

        if (keyword && keyword.trim() !== "") {
            const kw = keyword.trim();
            query.$and = [
                {
                    $or: [
                        { name: { $regex: kw, $options: "i" } },
                        { location: { $regex: kw, $options: "i" } },
                        { website: { $regex: kw, $options: "i" } },
                        { description: { $regex: kw, $options: "i" } },
                    ],
                },
            ];
        }

        if (!hasPagination) {
            const companies = await Company.find(query).sort({ createdAt: -1 });
            const responsePayload = {
                message: companies.length === 0 ? "No companies found" : "Companies fetched successfully",
                success: true,
                companies,
            };

            await setCache(cacheKey, responsePayload, CACHE_TTL.MEDIUM);

            return res.status(200).json(responsePayload);
        }

        const [companies, total] = await Promise.all([
            Company.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Company.countDocuments(query),
        ]);

        const responsePayload = {
            message: total === 0 ? "No companies found" : "Companies fetched successfully",
            success: true,
            companies,
            pagination: buildPaginationResponse(page, limit, total),
        };

        await setCache(cacheKey, responsePayload, CACHE_TTL.MEDIUM);

        return res.status(200).json(responsePayload);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch companies",
            success: false
        });
    }
};


// GET COMPANY BY ID
const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const cacheKey = `companies:detail:${companyId}`;

        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        const responsePayload = {
            message: "Company found",
            success: true,
            company
        };

        await setCache(cacheKey, responsePayload, CACHE_TTL.LONG);

        return res.status(200).json(responsePayload);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch company",
            success: false
        });
    }
};

const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;
        const { name, description, website, location } = req.body;
        const file = req.file;
        
        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;

        if (Object.keys(updateData).length === 0 && !file) {
            return res.status(400).json({
                message: "No data provided to update",
                success: false
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            updateData,
            { new: true }
        );

        // Invalidate company caches, user list, and populated job caches
        await Promise.all([
            deleteCache(`companies:detail:${companyId}`),
            deleteKeysByPattern(`companies:user:${userId}:*`),
            deleteKeysByPattern("jobs:all:*"),
            deleteKeysByPattern("jobs:admin:*"),
            deleteKeysByPattern("jobs:detail:*"),
            deleteKeysByPattern("ai_match:*"),
        ]);

        return res.status(200).json({
            message: "Company updated successfully",
            success: true,
            company: updatedCompany
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update company",
            success: false
        });
    }
};

export default {
    registerCompany,
    getCompanies,
    getCompanyById,
    updateCompany
};