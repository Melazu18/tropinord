# generate_swish_qr.py
import qrcode
import os

def generate_swish_qr(swish_number, amount, reference, order_id):
    formatted_amount = str(amount).replace('.', ',')
    payload = f"C{swish_number};{formatted_amount};{reference};0"
    
    # Ensure directory exists
    folder = "public/images"
    os.makedirs(folder, exist_ok=True)

    filename = f"swish_order_{order_id}.png"
    path = os.path.join(folder, filename)

    qr = qrcode.make(payload)
    qr.save(path)
    print(f"✅ QR saved to {path}")
    return path

# Example usage:
if __name__ == "__main__":
    generate_swish_qr(
        swish_number="1230558973",
        amount=49.00,
        reference="TropiNord Order #1001",
        order_id=1001
    )
