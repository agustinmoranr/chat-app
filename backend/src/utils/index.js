function filterDeletedRecords(array = []) {
	return array.filter(({ deleted }) => !deleted);
}

module.exports = { filterDeletedRecords };
