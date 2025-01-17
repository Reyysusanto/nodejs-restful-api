import contactService from "../service/contact-service.js"

const create = async (req, res, next) => {
    try {
        const result = await contactService.createContact(req.user, req.body)
        res.status(200).json({
            data: result
        })
    }catch(err) {
        next(err)
    }
}

export default { create }