const CheckProductAvailableStock = require('./check-product-available-stock')

class AddProduct {
  constructor({ productRepository }) {
    this.productRepository = productRepository
  }

  async execute({ cartId, product }) {
    const { sku, quantity } = product

    const checkProductAvailableStock = new CheckProductAvailableStock()

    const productAvailable = await checkProductAvailableStock.execute({
      sku,
      quantity,
    })

    if (!productAvailable.inStock) throw new Error('Product Unavailable')

    const productSchema = {
      ...product,
      cart_id: cartId,
    }

    await this.productRepository.create({
      data: productSchema,
    })
  }
}

module.exports = AddProduct
