const errorHandler = async (err, req, res, next) => {
  try {
    console.log(err);
    let statusCode = err.status || 500;

    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internak server error",
    });
  }
};

module.exports = { errorHandler };
