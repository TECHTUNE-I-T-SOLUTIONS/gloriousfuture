import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST: Create a new assignment
export async function POST(req: Request) {
  try {
    const { teacher_id, title, description, due_date, class_id } = await req.json();

    const { data, error } = await supabase
      .from("assignments")
      .insert([{ teacher_id, title, description, due_date, class_id }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

// GET: Retrieve assignments along with submitted assignments
export async function GET() {
  try {
    const { data: assignments, error: assignmentsError } = await supabase.from("assignments").select("*");

    if (assignmentsError) throw assignmentsError;

    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("id, assignment_id, pupil_id, submitted_at, file_url, text_submission, grade, feedback");

    if (submissionsError) throw submissionsError;

    return NextResponse.json({ assignments, submissions });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

// PATCH: Grade an assignment submission
export async function PATCH(req: Request) {
  try {
    const { submission_id, grade, feedback } = await req.json();

    const { data, error } = await supabase
      .from("submissions")
      .update({ grade, feedback })
      .eq("id", submission_id);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
