if defined?(SwaggerUiEngine)
  SwaggerUiEngine.configure do |config|
    config.swagger_url = {
      "v1" => "/doc/openapi.yaml"
    }
  end
end