# gen binary
```python
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. chat.proto

```

# Generate JavaScript/TypeScript gRPC client

```bash
protoc -I=. chat.proto \
  --js_out=import_style=commonjs:./frontend/src/proto \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend/src/proto

```

