export async function POST(req) {
    const body= await req.json()
    const result=loginSchema.safeParse(body);
    if(!result.success){
        return NextResponse.json(  { message:"Validation error"},
        {status:400})
    }
}