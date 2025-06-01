# client.py
import grpc
import threading
import time
import chat_pb2
import chat_pb2_grpc

def listen_messages(stub, username):
    def message_generator():
        while True:
            msg = input("")
            yield chat_pb2.ChatMessage(
                user=username,
                message=msg,
                timestamp=int(time.time())
            )

    responses = stub.ChatStream(message_generator())
    for res in responses:
        print(f"[{res.user}] {res.message}")

def main():
    channel = grpc.insecure_channel('localhost:50051')
    stub = chat_pb2_grpc.ChatServiceStub(channel)
    username = input("Enter your name: ")

    thread = threading.Thread(target=listen_messages, args=(stub, username))
    thread.start()
    thread.join()

if __name__ == "__main__":
    main()

