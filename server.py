# server.py
import grpc
import time
import threading
from concurrent import futures
import chat_pb2
import chat_pb2_grpc

clients = []

class ChatService(chat_pb2_grpc.ChatServiceServicer):
    def ChatStream(self, request_iterator, context):
        client_queue = []
        clients.append(client_queue)

        try:
            for msg in request_iterator:
                print(f"[{msg.user}] {msg.message}")
                for client in clients:
                    client.append(msg)
        except:
            print("Client disconnected")
        finally:
            clients.remove(client_queue)

        return iter(client_queue)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chat_pb2_grpc.add_ChatServiceServicer_to_server(ChatService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC Chat Server started.")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()

