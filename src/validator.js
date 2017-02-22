const childValidator = array => {
	return array.reduce((bool, item) => {
		return Array.isArray(item) && bool
	}, true);
}

export const validator = data => {
	if (!Array.isArray(data)) {
		return false;
	}

	if (!childValidator(data)) {
		return false;
	}

	return true;
}
