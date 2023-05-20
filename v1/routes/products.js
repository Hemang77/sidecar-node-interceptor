const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/add/product', productController.add);
router.get('/get/product/:sku', productController.get);
module.exports = router;
