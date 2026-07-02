import { Company } from '../models/company.model.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
import {
    getPaginationParams,
    buildPaginationResponse,
} from '../utils/pagination.js';

// REGISTER COMPANY
const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

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
            createdBy: req.id,
        });

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

        const query = { createdBy: userId };
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        if (!hasPagination) {
            const companies = await Company.find(query).sort({ createdAt: -1 });
            return res.status(200).json({
                message: companies.length === 0 ? "No companies found" : "Companies fetched successfully",
                success: true,
                companies,
            });
        }

        const { page, limit, skip } = getPaginationParams(req, 10);

        const [companies, total] = await Promise.all([
            Company.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Company.countDocuments(query),
        ]);

        return res.status(200).json({
            message: total === 0 ? "No companies found" : "Companies fetched successfully",
            success: true,
            companies,
            pagination: buildPaginationResponse(page, limit, total),
        });

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

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company found",
            success: true,
            company
        });

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
        const { name, description, website, location } = req.body;
        const file = req.file;
        
        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No data provided to update",
                success: false
            });
        }

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

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