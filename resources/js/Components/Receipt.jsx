import React from "react";
import { rupiah } from "../utils/rupiah";

const Receipt = React.forwardRef(
  ({ cartItems, subTotal, discount = 0, totalAmount, cash, change }, ref) => {
    return (
      <div ref={ref} className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        {/* Container utama struk */}
        <div className="bg-white border rounded shadow p-4 small" style={{ maxWidth: "350px" }}>
          {/* Header Struk */}
          <div className="text-center mb-3">
            <h5 className="mb-1 fw-bold">EasyPOS</h5>
            <p className="mb-1">Jl. Raya No. 123, Sleman, Yogyakarta</p>
            <p className="mb-1">Tel: (021) 12345678</p>
            {/* Garis pembatas */}
            <div className="border-bottom border-dark mb-2">
              <small>Tanggal: {new Date().toLocaleDateString()}</small>
            </div>
          </div>

          {/* Tabel Item Pembelian */}
          <table className="table table-borderless mb-3">
            <thead>
              <tr className="border-bottom border-secondary">
                <th className="pb-2 text-start">Item</th>
                <th className="pb-2 text-end">Harga</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">
                    <div className="fw-semibold">
                      {item.name || "Produk Tidak Ditemukan"}
                    </div>
                    <div>
                      {item.quantity} x {rupiah(item.selling_price)}
                    </div>
                  </td>
                  <td className="py-2 text-end">
                    {rupiah(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Informasi Pembayaran */}
          <div className="border-top border-dark pt-2">
            {/* Subtotal */}
            <div className="d-flex justify-content-between mb-1">
              <span className="fw-semibold">Subtotal:</span>
              <span className="fw-semibold">{rupiah(subTotal)}</span>
            </div>
            {/* Diskon (Jika Ada) */}
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-1">
                <span>Discount:</span>
                <span className="text-danger">-{rupiah(discount)}</span>
              </div>
            )}
            {/* Total Setelah Diskon */}
            {discount > 0 ? (
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">{rupiah(totalAmount)}</span>
              </div>
            ) : (
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">{rupiah(subTotal)}</span>
              </div>
            )}
            {/* Cash yang Dibayarkan */}
            <div className="d-flex justify-content-between mb-1">
              <span>Cash:</span>
              <span>{rupiah(cash)}</span>
            </div>
            {/* Kembalian */}
            <div className="d-flex justify-content-between">
              <span>Change:</span>
              <span>{rupiah(change)}</span>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="text-center border-top border-dark mt-3 pt-2">
            <p className="mb-1">*** Terima Kasih ***</p>
            <small>Barang yang sudah dibeli tidak dapat dikembalikan</small>
          </div>
        </div>
      </div>
    );
  }
);

export default Receipt;
