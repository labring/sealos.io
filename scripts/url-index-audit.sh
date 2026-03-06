#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://sealos.io}"
SAMPLE_SIZE="${2:-80}"

KEY_URLS=(
  "/pricing"
  "/pricing/"
  "/docs"
  "/docs/"
  "/blog/eaglercraft-server"
  "/blog/eaglercraft-server/"
  "/blog/claude-code-on-phone"
  "/blog/claude-code-on-phone/"
)

print_header() {
  echo "=== URL Audit ==="
  echo "Base URL: ${BASE_URL}"
  echo "Sample Size: ${SAMPLE_SIZE}"
  echo
}

extract_canonical() {
  local url="$1"
  curl -m 60 -sL "${url}" \
    | rg -o '<link rel="canonical" href="[^"]+"' -m1 \
    | sed -E 's/.*href="([^"]+)"/\1/' || true
}

audit_key_urls() {
  echo "## Key URLs"
  for path in "${KEY_URLS[@]}"; do
    local url="${BASE_URL}${path}"
    local status final canonical
    status="$(curl -m 60 -s -o /dev/null -w "%{http_code}" "${url}")"
    final="$(curl -m 60 -s -o /dev/null -w "%{url_effective}" -L "${url}")"
    canonical="$(extract_canonical "${url}")"

    echo "URL: ${url}"
    echo "  status: ${status}"
    echo "  final: ${final}"
    echo "  canonical: ${canonical:-N/A}"
  done
  echo
}

audit_sitemap() {
  local sitemap_url="$1"
  local tmp
  tmp="$(mktemp)"

  curl -m 60 -s "${sitemap_url}" \
    | rg -o '<loc>[^<]+' \
    | sed 's/<loc>//' \
    | awk -v n="${SAMPLE_SIZE}" 'NR <= n { print }' > "${tmp}"

  local total c2 c3 c4 c5 other canon_match canon_mismatch canon_missing
  total="$(wc -l < "${tmp}" | tr -d ' ')"
  c2=0
  c3=0
  c4=0
  c5=0
  other=0
  canon_match=0
  canon_mismatch=0
  canon_missing=0

  while IFS= read -r url; do
    local code final canonical
    code="$(curl -m 20 -s -o /dev/null -w "%{http_code}" "${url}")"
    case "${code}" in
      2*) c2=$((c2 + 1)) ;;
      3*) c3=$((c3 + 1)) ;;
      4*) c4=$((c4 + 1)) ;;
      5*) c5=$((c5 + 1)) ;;
      *) other=$((other + 1)) ;;
    esac

    final="$(curl -m 20 -s -o /dev/null -w "%{url_effective}" -L "${url}")"
    canonical="$(extract_canonical "${url}")"

    if [[ -z "${canonical}" ]]; then
      canon_missing=$((canon_missing + 1))
    elif [[ "${canonical}" == "${final}" ]]; then
      canon_match=$((canon_match + 1))
    else
      canon_mismatch=$((canon_mismatch + 1))
    fi
  done < "${tmp}"

  echo "## Sitemap Sample: ${sitemap_url}"
  echo "  sample_size: ${total}"
  echo "  status_2xx: ${c2}"
  echo "  status_3xx: ${c3}"
  echo "  status_4xx: ${c4}"
  echo "  status_5xx: ${c5}"
  echo "  status_other: ${other}"
  echo "  canonical_match: ${canon_match}"
  echo "  canonical_mismatch: ${canon_mismatch}"
  echo "  canonical_missing: ${canon_missing}"
  echo

  rm -f "${tmp}"
}

main() {
  print_header
  audit_key_urls
  audit_sitemap "${BASE_URL}/sitemap.xml"
  audit_sitemap "${BASE_URL}/ai-quick-reference/sitemap.xml"
}

main "$@"
