class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // filtering
    const queryObject = { ...this.queryStr };
    const exclude = ['page', 'sort', 'limit', 'fields'];
    exclude.forEach(el => delete queryObject[el]);

    // Advance filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const field = this.queryStr.fields.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagginate() {
    // Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   const numTour = await Tour.countDocuments();
    //   if (skip >= numTour) throw new Error('This page does not exists');
    // }
    return this;
  }
}

module.exports = APIFeatures;
