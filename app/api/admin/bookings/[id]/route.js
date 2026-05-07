import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function ser(b) {
  if (!b) return b;
  const out = { ...b };
  ["totalValue", "agreementValue", "registrationValue", "bookingAmount", "amountReceived", "stampDuty", "registration", "gst", "loanAmount", "refundAmount"].forEach((k) => {
    if (out[k] !== undefined && out[k] !== null) out[k] = out[k].toString();
  });
  return out;
}

export async function PATCH(req, { params }) {
  if (!prisma) return NextResponse.json({ error: "DB not ready" }, { status: 500 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data = {};
    const allowed = ["status", "kycComplete", "kycAadhaar", "kycPan", "kycAddress", "kycIncome", "kycPhoto", "paymentMode", "paymentRef", "internalNotes", "customerNotes", "unitNumber", "configuration", "agreementSigned", "allotmentIssued", "possessionGiven", "loanBank", "loanStatus", "cancellationReason", "refundStatus"];
    const bigintFields = ["totalValue", "agreementValue", "registrationValue", "bookingAmount", "amountReceived", "stampDuty", "registration", "gst", "loanAmount", "refundAmount"];
    const dateFields = ["paidAt", "agreementDate", "allotmentDate", "possessionDate"];
    const boolFields = ["kycComplete", "kycAadhaar", "kycPan", "kycAddress", "kycIncome", "kycPhoto", "agreementSigned", "allotmentIssued", "possessionGiven"];

    for (const f of allowed) {
      if (f in body) {
        if (boolFields.includes(f)) data[f] = !!body[f];
        else data[f] = body[f] === "" ? null : body[f];
      }
    }
    for (const f of bigintFields) {
      if (f in body) data[f] = body[f] ? BigInt(body[f]) : 0n;
    }
    for (const f of dateFields) {
      if (f in body) data[f] = body[f] ? new Date(body[f]) : null;
    }
    const booking = await prisma.booking.update({ where: { id }, data });
    return NextResponse.json({ success: true, booking: ser(booking) });
  } catch (err) {
    console.error("[BOOKING UPDATE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
