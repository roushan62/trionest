<?php
/* ==========================================================================
   TrioNest Spaces — contact form mailer (works on Hostinger / any PHP host)
   --------------------------------------------------------------------------
   HOW IT WORKS
   js/main.js posts the form (name, phone, email, service, city, message)
   to this file. This script sanitises everything, detects spam via a
   hidden honeypot field, and sends the enquiry to the address below using
   PHP mail(). It always answers with JSON so the page can show a friendly
   result — and if mail() is unavailable the page falls back to opening a
   pre-filled email in the visitor's own mail app, so no lead is ever lost.

   TO CHANGE THE RECEIVING EMAIL: edit $to below (e.g. 'you@yourdomain.com').
   Hostinger tip: use an address on the same domain you host here, and if
   emails land in spam, add an SPF record (v=spf1 include:spf.hostinger.com ~all)
   in Hostinger > Domains > DNS.
   ========================================================================== */

header('Content-Type: application/json; charset=utf-8');

/* ---------------- CONFIG ---------------- */
$to      = 'spaces@trionest.in';          // <-- receiving address
$subject = 'New website enquiry — TrioNest Spaces';
$fromMail = 'website@' . (isset($_SERVER['HTTP_HOST']) ? preg_replace('/^www\./', '', $_SERVER['HTTP_HOST']) : 'trionest.in');
$fromName = 'TrioNest Website';

/* ---------------- helpers ---------------- */
function respond($ok, $msg = '') {
    echo json_encode(array('ok' => (bool)$ok, 'error' => $ok ? '' : $msg));
    exit;
}
function clean($v) {
    $v = trim((string)$v);
    $v = strip_tags($v);
    return mb_substr($v, 0, 2000);
}

/* ---------------- spam honeypot ---------------- */
/* Real users never see this field (it is hidden in CSS). Bots fill it in. */
if (!empty($_POST['company_website'])) {
    respond(true); // pretend success, drop the spam silently
}

/* ---------------- pick up + sanitise ---------------- */
$name    = clean(isset($_POST['name'])    ? $_POST['name']    : '');
$phone   = clean(isset($_POST['phone'])   ? $_POST['phone']   : '');
$email   = clean(isset($_POST['email'])   ? $_POST['email']   : '');
$service = clean(isset($_POST['service']) ? $_POST['service'] : 'General');
$city    = clean(isset($_POST['city'])    ? $_POST['city']    : '');
$message = clean(isset($_POST['message']) ? $_POST['message'] : '');

/* ---------------- validate ---------------- */
if ($name === '' || mb_strlen($name) < 2) {
    respond(false, 'Please enter your name.');
}
if ($phone === '' || !preg_match('/^[+\d][\d\s\-()]{9,16}$/', $phone)) {
    respond(false, 'Please enter a valid phone number.');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.');
}
if ($message === '' || mb_strlen($message) < 10) {
    respond(false, 'Please tell us a little more about your requirement (at least 10 characters).');
}

/* ---------------- build the email ---------------- */
$lines = array(
    "You have a new enquiry from the TrioNest Spaces website.",
    "",
    "Name    : " . $name,
    "Phone   : " . $phone,
    "Email   : " . ($email !== '' ? $email : '(not provided)'),
    "Service : " . $service,
    "City    : " . ($city !== '' ? $city : '(not provided)'),
    "IP      : " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown'),
    "",
    "Message:",
    $message
);
$body = implode("\n", $lines);

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: " . $fromName . " <" . $fromMail . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . ($email !== '' ? $email : $fromMail) . ">\r\n";
$headers .= "X-Mailer: TrioNest-Website/1.0\r\n";

$subject = $subject . ' — ' . $name . ' (' . $service . ')';

/* ---------------- send ---------------- */
$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    respond(true);
}
respond(false, 'Could not send the email right now — please try the email/phone options shown on the page.');
