namespace OMPolymer.API.DTOs.Responses
{
    public class PaginatedResponse<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));

        public PaginatedResponse(IEnumerable<T> items, int totalCount, int currentPage, int pageSize)
        {
            Items = items;
            TotalCount = totalCount;
            CurrentPage = currentPage;
            PageSize = pageSize;
        }
    }
}