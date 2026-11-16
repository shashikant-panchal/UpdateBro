Add-Type -AssemblyName System.Drawing

function Build-AmbientStudioBanner {
    param (
        [string]$srcPath,
        [string]$outPath,
        [int]$targetW = 1920,
        [int]$targetH = 640,
        [int]$featherW = 36
    )

    Write-Output "Processing: $srcPath -> $outPath"
    $src = [System.Drawing.Bitmap]::FromFile((Resolve-Path $srcPath).Path)
    $sw = $src.Width
    $sh = $src.Height

    # 1. Output canvas
    $banner = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($banner)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 2. Atmospheric Ambient Backdrop
    # Downsample source to small grid, then upscale across full banner width
    $tinyW = 64
    $tinyH = 22
    $tinyBmp = New-Object System.Drawing.Bitmap($tinyW, $tinyH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gTiny = [System.Drawing.Graphics]::FromImage($tinyBmp)
    $gTiny.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gTiny.DrawImage($src, 0, 0, $tinyW, $tinyH)
    $gTiny.Dispose()

    # Draw ambient blurred backdrop filling entire 1920x640 canvas
    $g.DrawImage($tinyBmp, 0, 0, $targetW, $targetH)
    $tinyBmp.Dispose()

    # Apply subtle darkening overlay on the outer ambient wings so focus stays on hardware
    $rect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $vignetteBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(60, 0, 0, 0),
        [System.Drawing.Color]::FromArgb(20, 0, 0, 0),
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $g.FillRectangle($vignetteBrush, $rect)
    $vignetteBrush.Dispose()

    # 3. Proportional Main Image (Scale to targetH with ZERO distortion and ZERO stretching)
    $scale = $targetH / [double]$sh
    $scaledW = [int]([math]::Round($sw * $scale))
    $scaledH = $targetH
    $offsetX = [int](($targetW - $scaledW) / 2)

    $sharpBmp = New-Object System.Drawing.Bitmap($scaledW, $scaledH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gSharp = [System.Drawing.Graphics]::FromImage($sharpBmp)
    $gSharp.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gSharp.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gSharp.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gSharp.DrawImage($src, 0, 0, $scaledW, $scaledH)
    $gSharp.Dispose()
    $src.Dispose()

    # 4. Smooth Cosine Feathering on left and right borders of sharp image
    for ($y = 0; $y -lt $scaledH; $y++) {
        # Left edge feather
        for ($x = 0; $x -lt $featherW; $x++) {
            $t = [double]$x / [double]$featherW
            $alphaFactor = (1.0 - [math]::Cos($t * [math]::PI)) / 2.0
            $pixel = $sharpBmp.GetPixel($x, $y)
            $newAlpha = [int]($pixel.A * $alphaFactor)
            $sharpBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newAlpha, $pixel.R, $pixel.G, $pixel.B))
        }
        # Right edge feather
        for ($x = 0; $x -lt $featherW; $x++) {
            $t = [double]$x / [double]$featherW
            $alphaFactor = (1.0 - [math]::Cos($t * [math]::PI)) / 2.0
            $actualX = $scaledW - 1 - $x
            $pixel = $sharpBmp.GetPixel($actualX, $y)
            $newAlpha = [int]($pixel.A * $alphaFactor)
            $sharpBmp.SetPixel($actualX, $y, [System.Drawing.Color]::FromArgb($newAlpha, $pixel.R, $pixel.G, $pixel.B))
        }
    }

    # 5. Composite feathered sharp image on top
    $g.DrawImage($sharpBmp, $offsetX, 0, $scaledW, $scaledH)
    $sharpBmp.Dispose()
    $g.Dispose()

    # 6. Save as premium JPEG (quality 96)
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]96)

    # Save to temp file first, then move to avoid file locking issues
    $tempOut = $outPath + ".tmp.jpg"
    $banner.Save($tempOut, $encoder, $encoderParams)
    $banner.Dispose()

    Move-Item -Path $tempOut -Destination $outPath -Force
    Write-Output "Successfully updated banner: $outPath ($targetW x $targetH)"
}

$userDir = "C:/Users/shash/.gemini/antigravity/brain/f7f9e2a8-4748-487e-a940-923c0627ff62/.user_uploaded/"

$bannerMap = @{
    'banner-tws-earbuds.jpg'          = $userDir + 'media_1794821165703_be1d77ba.jpg';
    'banner-chargers.jpg'             = $userDir + 'media_1794821165707_cf5ea176.jpg';
    'banner-headphones-neckbands.jpg' = $userDir + 'media_1794821165707_0893f802.jpg';
    'banner-25w-charger.jpg'          = $userDir + 'media_1794821165710_8e5aaa8a.jpg';
    'banner-120w-charger.jpg'         = $userDir + 'media_1794821165714_3ec8fe2c.jpg';
}

foreach ($entry in $bannerMap.GetEnumerator()) {
    $out = "public/assets/" + $entry.Key
    Build-AmbientStudioBanner -srcPath $entry.Value -outPath $out -targetW 1920 -targetH 640
}
