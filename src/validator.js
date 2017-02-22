const childValidator = array => (
	array.reduce((bool, item) => {
		return Array.isArray(item) && bool;
	}, true)
);

const validator = (data) => {
	if (!Array.isArray(data)) {
		return false;
	}

	if (!childValidator(data)) {
		return false;
	}

	return true;
};

export default validator;
