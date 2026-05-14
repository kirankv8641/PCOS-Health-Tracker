const express  = require("express");
const router   = express.Router();
const protect  = require("../middleware/authMiddleware");
const {
  getDietLogs,
  createOrUpdateDietLog,
  addDietItem,
  deleteDietLog,
  removeDietItem,
} = require("../controllers/dietController");

router.get(    "/",           protect, getDietLogs);
router.post(   "/",           protect, createOrUpdateDietLog);
router.patch(  "/:date",      protect, addDietItem);
router.delete( "/:id",        protect, deleteDietLog);
router.delete( "/:date/item", protect, removeDietItem);

module.exports = router;