<?php
/**
 * TrioNest Spaces contact-form mailer.
 * Hostinger-compatible, database-free, and intentionally dependency-free.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');

function reply(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, false, 'Method not allowed.');
}

// Bots commonly complete this visually hidden field. Return a neutral success response.
if (trim((string) ($_POST['_gotcha'] ?? '')) !== '') {
    reply(200, true, 'Thank you. Your enquiry has been received.');
}

function clean(string $key, int $max = 200): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

$name = clean('Name', 100);
$company = clean('Company', 150);
$email = clean('Email', 254);
$phone = clean('Phone', 40);
$scope = clean('Scope', 100);
$requirement = clean('Requirement', 4000);

if ($name === '' || $company === '' || $email === '' || $phone === '' || $scope === '' || $requirement === '') {
    reply(422, false, 'Please complete all required fields.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, false, 'Please enter a valid email address.');
}
if (!preg_match('/^[0-9+()\-\s]{7,40}$/', $phone)) {
    reply(422, false, 'Please enter a valid phone number.');
}

$optional = [
    'Designation' => clean('Designation', 120),
    'Project location' => clean('Project_location', 240),
    'Approx. area' => clean('Approx_area', 80),
    'Expected start' => clean('Expected_start', 40),
];

$subjectLabel = clean('_subject', 120) ?: 'Website enquiry';
// Prevent mail-header injection even though the address itself is validated above.
$safeName = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safeSubject = str_replace(["\r", "\n"], ' ', $subjectLabel);

$lines = [
    'A new enquiry was submitted on trionest.in.',
    '',
    'Name: ' . $name,
    'Company: ' . $company,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Scope: ' . $scope,
];
foreach ($optional as $label => $value) {
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}
$lines[] = '';
$lines[] = 'Requirement:';
$lines[] = $requirement;
$lines[] = '';
$lines[] = 'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC';
$lines[] = 'Source: ' . substr((string) ($_SERVER['HTTP_REFERER'] ?? 'https://trionest.in/contact/'), 0, 500);

$to = 'spaces@trionest.in';
$subjectText = '[TrioNest Website] ' . $safeSubject . ' - ' . $safeName;
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';
$headers = [
    'From: TrioNest Website <spaces@trionest.in>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: TrioNest Website',
];

$sent = @mail($to, $subject, implode("\r\n", $lines), implode("\r\n", $headers));
if (!$sent) {
    error_log('TrioNest contact form: mail() failed for a valid submission.');
    reply(503, false, 'We could not send your enquiry right now. Please email spaces@trionest.in or call +91 93195 74674.');
}

reply(200, true, 'Thank you. Your enquiry has been received.');
