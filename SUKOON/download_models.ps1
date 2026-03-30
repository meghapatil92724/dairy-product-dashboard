$urls = @(
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json'
)
foreach ($u in $urls) {
  $filename = $u.Split('/')[-1]
  Write-Host "Downloading $filename..."
  Invoke-WebRequest -Uri $u -OutFile "public\models\$filename"
}
Write-Host "All models downloaded!"
