const CheckProductAvailableStock = require('./check-product-available-stock')

class UpdateProductQuantity {
  constructor({ productRepository, getCartInteractor }) {
    this.productRepository = productRepository
    this.getCartInteractor = getCartInteractor
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

    await this.productRepository.updateById(product.id, productSchema)

    const cart = await this.getCartInteractor.execute({ id: cartId })

    return cart
  }
}

module.exports = UpdateProductQuantity
