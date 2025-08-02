import moment from "moment";

export const pagination = (sumDocuments: number, queryPage: string = "1") => {
  let skip = 0;
  const page = 1;
  const limit = 2;
  const pages = Math.ceil(sumDocuments / limit);
  if (queryPage) {
    let pageNumber = parseInt(String(queryPage));

    if (pageNumber < page || pageNumber > pages) {
      pageNumber = page;
    };
    skip = (pageNumber - 1) * limit;
  }
  return {
    skip: skip,
    limit: limit,
    pages: pages
  }
}

export const dateFillters = (queryStartDate?:string, queryEndDate?:string) => {
    const dataDate:any = {}
    if(queryStartDate) {
      const startDate = moment(String(queryStartDate)).startOf("date").toDate();
      dataDate.$gte = startDate;
    };
  
    if(queryEndDate) {
      const endDate = moment(String(queryEndDate)).endOf("date").toDate();
      dataDate.$lte = endDate;
    };

    return dataDate;
}