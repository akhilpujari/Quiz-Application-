let token = localStorage.getItem("token");
            $.ajax({
                url: 'api/certification.php',
                method: 'GET',
                headers: {
                    Authorization: token
                },
                success: function(response) {
                    const result = typeof response === 'string' ? JSON.parse(response) : response;
                    console.log(result);
                    if (result.status === 200 && result.data.length) {
                        result.data.forEach(cert => {
                            $('#certificateContainer').append(`
                                <div class="col-md-8">
                                    <div class="card border-warning border-5 rounded-4 shadow-lg">
                                        <div class="card-body p-5 text-center bg-white">
                                            <div class="border-bottom border-warning border-3 pb-4 mb-4">
                                                <h2 class="card-title text-uppercase fw-bold text-warning">
                                                    <i class="bi bi-award-fill me-2"></i>Certificate of Achievement
                                                </h2>
                                            </div>
                                            <p class="fs-5 mb-4">This is to certify that</p>
                                            <h3 class="display-6 fw-bold mb-4 text-primary">${localStorage.getItem("username")}</h3>
                                            <p class="fs-5 mb-4">has successfully completed</p>
                                            <h4 class="fw-bold mb-4 text-decoration-underline">${cert.quiz_title}</h4>
                                            <div class="d-flex justify-content-center gap-5 my-4">
                                                <div class="text-center">
                                                    <p class="mb-1 text-muted">Score</p>
                                                    <span class="badge bg-success fs-5 p-3">${Math.floor((cert.best_score/cert.total_questions)*100)}%</span>
                                                </div>
                                                <div class="text-center">
                                                    <p class="mb-1 text-muted">Status</p>
                                                    <span class="badge bg-primary fs-5 p-3">Passed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        });
                    } else {
                        $('#certificateContainer').html(`
                            <div class="col-12 text-center py-5">
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle-fill me-2"></i>
                                    No certifications available yet. Keep learning!
                                </div>
                            </div>
                        `);
                    }
                },
                error: function(err) {
                    $('#certificateContainer').html(`
                        <div class="col-12 text-center py-5">
                            <div class="alert alert-danger">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                Failed to load certificates. Please try again later.
                            </div>
                        </div>
                    `);
                    console.error("Failed to load certificates", err);
                }
            });