import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router();

//GET
cartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartModel.findById(id);
    if (cart) res.status(200).send({ respuesta: "OK", mensaje: cart });
    else
      res.status(404).send({
        respuesta: "Error en consultar Carrito",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consulta carrito", mensaje: error });
  }
});

//POST
cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({});
    res.status(200).send({ respuesta: "OK", mensaje: cart });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear Carrito", mensaje: error });
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);

      if (prod) {
        const indice = cart.products.findIndex((item) => item.id_prod == pid);
        if (indice != -1) {
          cart.products[indice].quantity = quantity;
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error en agregar producto Carrito",
          mensaje: "Produt Not Found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error en agregar producto Carrito",
        mensaje: "Cart Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ respuesta: "Error en agregar producto Carrito", mensaje: error });
  }
});

//PUT
cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  const cartId = parseInt(cid);

  try {
    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    );
    res.status(200).json({
      respuesta: "OK",
      mensaje: "Carrito actualizado",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      respuesta: "Error en actualizar carrito",
      mensaje: error.message,
    });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  // Convertir los parámetros cid y pid a números
  const cartId = parseInt(cid);
  const productId = parseInt(pid);

  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        respuesta: "Error en actualizar cantidad de producto en carrito",
        mensaje: "Carrito no encontrado",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        respuesta: "Error en actualizar cantidad de producto en carrito",
        mensaje: "Producto no encontrado",
      });
    }

    // Buscar el índice del producto en el carrito
    const productIndex = cart.products.findIndex((item) =>
      item.id_prod.equals(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({
        respuesta: "Error en actualizar cantidad de producto en carrito",
        mensaje: "Producto no encontrado en el carrito",
      });
    }

    // Actualizar la cantidad del producto
    cart.products[productIndex].quantity = quantity;

    // Guardar el carrito actualizado
    await cart.save();

    res.status(200).json({
      respuesta: "OK",
      mensaje: "Cantidad de producto actualizada en el carrito",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      respuesta: "Error en actualizar cantidad de producto en carrito",
      mensaje: error.message,
    });
  }
});

//DELETE
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Convertir los parámetros cid y pid a números
  const cartId = parseInt(cid);
  const productId = parseInt(pid);

  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        respuesta: "Error en eliminar producto del carrito",
        mensaje: "Carrito no encontrado",
      });
    }

    // Filtrar los productos del carrito para eliminar el producto seleccionado
    cart.products = cart.products.filter(
      (item) => !item.id_prod.equals(productId)
    );

    // Guardar el carrito actualizado
    await cart.save();

    res.status(200).json({
      respuesta: "OK",
      mensaje: "Producto eliminado del carrito",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      respuesta: "Error en eliminar producto del carrito",
      mensaje: error.message,
    });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  // Convertir el parámetro cid a un número
  const cartId = parseInt(cid);

  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        respuesta: "Error en eliminar todos los productos del carrito",
        mensaje: "Carrito no encontrado",
      });
    }

    // Eliminar todos los productos del carrito
    cart.products = [];

    // Guardar el carrito actualizado
    await cart.save();

    res.status(200).json({
      respuesta: "OK",
      mensaje: "Todos los productos eliminados del carrito",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      respuesta: "Error en eliminar todos los productos del carrito",
      mensaje: error.message,
    });
  }
});

export default cartRouter;
