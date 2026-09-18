const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const uploadBanner = require('../middleware/uploadBanner.middleware');

router.route('/')
  .get(bannerController.getBanners)
  .post(protect, adminOnly, bannerController.createBanner);

router.put('/reorder', protect, adminOnly, bannerController.reorderBanners);

router.route('/:id')
  .get(bannerController.getBannerById)
  .put(protect, adminOnly, bannerController.updateBanner)
  .delete(protect, adminOnly, bannerController.deleteBanner);

router.post('/:id/upload', protect, adminOnly, uploadBanner.single('image'), bannerController.uploadBannerImage);

module.exports = router;
