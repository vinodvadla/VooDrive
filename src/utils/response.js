module.exports = {
  success(res, message = "Success", data = {}) {
    return res.status(200).json({ success: true, message, data });
  },

  created(res, message = "Resource created", data = {}) {
    return res.status(201).json({ success: true, message, data });
  },

  badRequest(res, message = "Bad request", data = {}) {
    return res.status(400).json({ success: false, message, data });
  },

  unauthorized(res, message = "Unauthorized") {
    return res.status(401).json({ success: false, message });
  },

  forbidden(res, message = "Forbidden") {
    return res.status(403).json({ success: false, message });
  },

  notFound(res, message = "Not found") {
    return res.status(404).json({ success: false, message });
  },

  error(res, message = "Internal server error", data = {}) {
    return res.status(500).json({ success: false, message, data });
  },
};
