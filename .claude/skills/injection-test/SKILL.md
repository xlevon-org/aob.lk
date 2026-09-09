---
name: injection-test
description: Adversarial and fault-injection testing for ZOVAX - corrupted browser storage, hostile values for money and quantity, identity abuse, hostile content in admin-authored fields, and forced API failures. Use when hardening a change, or before declaring an input surface safe.
---

# Injection & Fault Injection

Attack the change. For every attempt record **input / expected / observed / PASS-FAIL**.

## Browser storage

`LocalStorageCartRepository`, `LocalStorageRepositories`, `DisplayPreferences`, the cookie consent key. Corrupt the value and reload:

- key absent; empty string; the string `null`; valid JSON of the wrong shape
- an array where an object is expected, and the reverse
- a quantity of `-1`, `0`, `1e309`, `"3"`, `null`
- a product id that no longer exists in the catalogue
- a cart referencing a product whose price has since changed
- storage that **throws** on read and on write (private mode, blocked by policy)

The app must degrade to a sane default. A blank screen or an unhandled throw is a hard FAIL. Reads already guard this   verify the guard, do not assume it.

## Money and quantity

`0`, negative, non-integer, `NaN`, `Infinity`, `Number.MAX_SAFE_INTEGER`; a price below its own original; a subtotal exactly at the free-delivery threshold and one cent either side; a discount that would compute above 100%; a refund exceeding the order total.

## Identity

OTP replay; expired challenge; wrong challenge id; one attempt past the lockout; a password at exactly the minimum length and one below; unicode names; a 320-character email; sign-in during lockout; a reset token used twice.

## Content and media

A missing image; a URL that 404s; an oversized upload; an SVG containing script; and an HTML or JavaScript payload in **any admin-authored field** that reaches `dangerouslySetInnerHTML` or an HTML attribute. Content pages store HTML   it must be sanitised server-side, never only on render.

## Once the API exists

- unauthenticated; authenticated but unauthorised, **once per permission**
- a mutation against a soft-deleted record
- a status transition the table forbids
- a duplicate slug; a product referencing a deleted brand; a brand deleted while products reference it
- a required environment variable absent at boot   it must fail loudly at startup, not lazily on first request
- a Cloudinary or MongoDB outage mid-request

## Rules

- Every FAIL gets a regression test written **before** the fix, so it cannot silently return.
- A leaked stack trace, a 500 where a 4xx belongs, or a corrupted persisted state is a hard FAIL regardless of how unlikely the input seemed.
- Report what you could not reach, and why. An untested surface is not a passing one.
