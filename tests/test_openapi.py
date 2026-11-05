from bugdiag.main import app


def test_openapi_documents_text_and_file_submission_inputs():
    schema = app.openapi()
    content = schema["paths"]["/api/submit"]["post"]["requestBody"]["content"]

    assert "application/json" in content
    assert "multipart/form-data" in content
    assert schema["paths"]["/api/submit"]["post"]["responses"]["200"]["content"]["application/json"]
