module.exports = (validate, from = "body") => {
    return async (req, res, next) => {
        try {
            let validateFrom;

            switch (from.toLowerCase()) {
                case "body":
                    validateFrom = req.body;
                    break;
                case "params":
                    validateFrom = req.params;
                    break;
                case "query":
                    validateFrom = req.query;
                    break;
                default:
                    return next(new Error(`Invalid validation source: ${from}`));
            }

            await validate.validate(validateFrom);

            next();
        } catch (error) {

            next(error)
        }
    };
};