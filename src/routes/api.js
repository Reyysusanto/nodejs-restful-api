import express from "express"
import userController from "../controller/user-controller.js"
import contactController from "../controller/contact-controller.js"
import { authMiddleware } from "../middleware/auth-middleware.js"
import addressContoller from "../controller/address-contoller.js"

const userRouter = new express.Router()

userRouter.use(authMiddleware)
userRouter.get('/api/users/current', userController.get)
userRouter.patch('/api/users/current', userController.update)
userRouter.delete('/api/users/logout', userController.logOut)

userRouter.post('/api/contacts', contactController.create)
userRouter.get('/api/contacts/:contactId', contactController.get)
userRouter.put('/api/contacts/:contactId', contactController.update)
userRouter.delete('/api/contacts/:contactId', contactController.remove)
userRouter.get('/api/contacts', contactController.search)

userRouter.post('/api/contacts/:contactId/addresses', addressContoller.create)
userRouter.get('/api/contacts/:contactId/addresses/:addressId', addressContoller.get)
userRouter.put('/api/contacts/:contactId/addresses/:addressId', addressContoller.update)
userRouter.delete('/api/contacts/:contactId/addresses/:addressId', addressContoller.remove)

export { userRouter }