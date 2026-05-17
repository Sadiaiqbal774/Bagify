const dbService = require('../services/dbService');

// @desc    Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = dbService.find('products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = dbService.findOne('products', { slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock, slug, metaTitle, metaDescription, metaKeywords } = req.body;

  try {
    const product = dbService.create('products', {
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      slug,
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : []
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = dbService.findById('products', req.params.id);
    if (product) {
      const updates = {
        name: req.body.name || product.name,
        description: req.body.description || product.description,
        price: req.body.price ? Number(req.body.price) : product.price,
        category: req.body.category || product.category,
        stock: req.body.stock ? Number(req.body.stock) : product.stock,
        slug: req.body.slug || product.slug,
        metaTitle: req.body.metaTitle || product.metaTitle,
        metaDescription: req.body.metaDescription || product.metaDescription
      };
      
      if (req.body.metaKeywords) {
        updates.metaKeywords = req.body.metaKeywords.split(',').map(k => k.trim());
      }

      const updatedProduct = dbService.update('products', req.params.id, updates);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const success = dbService.delete('products', req.params.id);
    if (success) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
