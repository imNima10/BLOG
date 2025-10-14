module.exports = ({ validate, from = "body", url, reqBody }) => {
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

            await validate.validate(validateFrom, { abortEarly: false });

            next();
        } catch (error) {
            let theUrl = url;
            if (reqBody) {
                theUrl = `${url}/${req[from][reqBody]}`;
            }
            req.url = theUrl;
            next(error);
        }
    }
};