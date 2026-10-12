import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return handleNotFound(req);
}

export async function POST(req: NextRequest) {
  return handleNotFound(req);
}

export async function PUT(req: NextRequest) {
  return handleNotFound(req);
}

export async function PATCH(req: NextRequest) {
  return handleNotFound(req);
}

export async function DELETE(req: NextRequest) {
  return handleNotFound(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function handleNotFound(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  return NextResponse.json(
    {
      success: false,
      error: `API endpoint not found: ${req.method} ${pathname}`,
      status: 404,
    },
    {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
