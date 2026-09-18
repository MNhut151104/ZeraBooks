const Banner = require('../models/Banner');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const path = require('path');
const fs = require('fs');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public (active only) / Admin (showAll)
exports.getBanners = asyncHandler(async (req, res) => {
  const isShowAll = req.query.showAll === 'true';
  const query = isShowAll ? {} : { isActive: true };

  const banners = await Banner.find(query)
    .sort({ order: 1, createdAt: -1 });

  ResponseHandler.success(res, { banners });
});

// @desc    Get single banner by ID
// @route   GET /api/banners/:id
// @access  Public
exports.getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return ResponseHandler.notFound(res, 'Không tìm thấy banner');
  }

  ResponseHandler.success(res, { banner });
});

// @desc    Reorder banners (Admin)
// @route   PUT /api/banners/reorder
// @access  Private/Admin
exports.reorderBanners = asyncHandler(async (req, res) => {
  const { bannerOrders } = req.body;

  if (!Array.isArray(bannerOrders)) {
    return ResponseHandler.badRequest(res, 'Dữ liệu thứ tự không hợp lệ');
  }

  const updatePromises = bannerOrders.map(({ id, order }) =>
    Banner.findByIdAndUpdate(id, { order })
  );

  await Promise.all(updatePromises);

  const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });

  ResponseHandler.success(res, { banners }, 'Cập nhật thứ tự banner thành công');
});

// @desc    Create a new banner (Admin)
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, linkUrl, order, isActive } = req.body;

  // Auto assign order at end of list if not provided
  let bannerOrder = order !== undefined ? Number(order) : 0;
  if (order === undefined) {
    const maxOrderBanner = await Banner.findOne().sort('-order');
    bannerOrder = maxOrderBanner ? maxOrderBanner.order + 1 : 0;
  }

  const banner = await Banner.create({
    title: title || '',
    subtitle: subtitle || '',
    imageUrl: imageUrl || '/images/banners/default.jpg',
    linkUrl: linkUrl || '',
    order: bannerOrder,
    isActive: isActive !== undefined ? Boolean(isActive) : true
  });

  ResponseHandler.created(res, { banner }, 'Thêm banner thành công');
});

// @desc    Update banner (Admin)
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = asyncHandler(async (req, res) => {
  let banner = await Banner.findById(req.params.id);

  if (!banner) {
    return ResponseHandler.notFound(res, 'Không tìm thấy banner');
  }

  banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  ResponseHandler.success(res, { banner }, 'Cập nhật banner thành công');
});

// @desc    Delete banner (Admin)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return ResponseHandler.notFound(res, 'Không tìm thấy banner');
  }

  // Remove image file if stored locally in uploads
  if (banner.imageUrl && banner.imageUrl.startsWith('/images/banners/')) {
    const filePath = path.join(__dirname, '../../public', banner.imageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete banner image file:', err);
      }
    }
  }

  await Banner.findByIdAndDelete(req.params.id);

  ResponseHandler.success(res, null, 'Xóa banner thành công');
});

// @desc    Upload banner image (Admin)
// @route   POST /api/banners/:id/upload
// @access  Private/Admin
exports.uploadBannerImage = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return ResponseHandler.notFound(res, 'Không tìm thấy banner');
  }

  if (!req.file) {
    return ResponseHandler.badRequest(res, 'Vui lòng chọn file ảnh');
  }

  const imageUrl = `/images/banners/${req.file.filename}`;
  banner.imageUrl = imageUrl;
  await banner.save();

  ResponseHandler.success(res, { imageUrl, banner }, 'Tải ảnh banner lên thành công');
});
