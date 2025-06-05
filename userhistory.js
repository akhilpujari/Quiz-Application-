$(document).ready(function () {
    let currentPage = 1;

    const fetchUserHistory = (page) => {
        $.ajax({
            url: `api/userhistory.php?page=${page}`,
            method: 'GET',
            headers: {
                Authorization: localStorage.getItem("token"),
            },
            success: function (res) {
                const result = typeof res === 'string' ? JSON.parse(res) : res;
                const tbody = $("#userHistoryBody");
                tbody.empty();

                if (result.status === 200 && Array.isArray(result.data) && result.data.length) {
                    result.data.forEach(item => {
                        const formatDateTime = (str, type) => {
                            const date = new Date(str);
                            if (type === 'date') return date.toLocaleDateString('en-IN');
                            return date.toTimeString().split(' ')[0]; 
                        };

                        tbody.append(`
                            <tr>
                                <td>${item.user_id}</td>
                                <td>${item.username}</td>
                                <td>${item.quiz_title}</td>
                                <td>${formatDateTime(item.started_time, 'date')}</td>
                                <td>${formatDateTime(item.started_time)}</td>
                                <td>${formatDateTime(item.completion_time)}</td>
                                <td>${item.score}</td>
                                <td>${item.status ? 'Passed' : 'Failed'}</td>
                            </tr>
                        `);
                    });

                    $("#pageNumber").text(`Page: ${page}`);
                    $("#prevPage").prop('disabled', page === 1);
                    $("#nextPage").prop('disabled', result.data.length < 10);
                } else {
                    tbody.html("<tr><td colspan='8' class='text-center'>No data found</td></tr>");
                }
            },
            error: function () {
                $("#userHistoryBody").html("<tr><td colspan='8' class='text-center text-danger'>Failed to fetch user history</td></tr>");
            }
        });
    };

    fetchUserHistory(currentPage);

    $("#prevPage").click(function () {
        if (currentPage > 1) fetchUserHistory(--currentPage);
    });
    $("#nextPage").click(function () {
        fetchUserHistory(++currentPage);
    });
});
