for f in imported_*; do
  mv -- "$f" "${f#imported_}"
done