const { Resource, User } = require("../models");
const response = require("../utils/response");

const createResource = async (req, res, next) => {
  try {
    // const ownerId = req.user.id;
    // const resource = await Resource.create({
    //   ...req.body,
    //   ownerId,
    // });

    console.log("file", req.file);
    return response.created(res, "Resource created successfully", {});
  } catch (error) {
    console.error("Create Error:", error);
    next(error);
  }
};

const getAllResources = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: resources } = await Resource.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Resource, as: "parent" },
        { model: User, as: "owner" },
      ],
    });

    return response.success(res, "Resources fetched successfully", {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: resources,
    });
  } catch (error) {
    console.error("GetAll Error:", error);
    next(error);
  }
};

const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        { model: Resource, as: "parent" },
        { model: User, as: "owner" },
      ],
    });

    if (!resource) {
      return response.badRequest(res, "Resource not found");
    }

    return response.success(res, "Resource fetched successfully", resource);
  } catch (error) {
    console.error("GetOne Error:", error);
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id);

    if (!resource) {
      return response.badRequest(res, "Resource not found");
    }

    await resource.update(req.body);
    return response.success(res, "Resource updated successfully", resource);
  } catch (error) {
    console.error("Update Error:", error);
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id);

    if (!resource) {
      return response.badRequest(res, "Resource not found");
    }

    await resource.destroy();
    return response.success(res, "Resource deleted successfully");
  } catch (error) {
    console.error("Delete Error:", error);
    next(error);
  }
};

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
};
