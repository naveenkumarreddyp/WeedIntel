$weeds = @{
    "weed_barnyard_grass.jpg" = "Echinochloa_crus-galli_kz01.jpg"
    "weed_variable_flatsedge.jpg" = "Cyperus_difformis_P6100113.jpg"
    "weed_pickerelweed.jpg" = "Monochoria_vaginalis_01.JPG"
    "weed_murainagrass.jpg" = "Ischaemum_semisagittatum_Roxb.jpg"
    "weed_water_primrose.jpg" = "Ludwigia_octovalvis5.jpg"
    "weed_knotgrass.jpg" = "Paspalum_distichum.jpg"
    "weed_globe_fimbry.jpg" = "Fimbristylis_miliacea.JPG"
    "weed_gooseweed.jpg" = "Sphenoclea_zeylanica_08517.jpg"
    "weed_purple_nutsedge.jpg" = "Cyperus_rotundus_by_kadavoor.JPG"
    "weed_bermuda_grass.jpg" = "Cynodon_dactylon_01.jpg"
    "weed_congress_grass.jpg" = "Parthenium_hysterophorus_plant_with_flowers.jpg"
    "weed_pigweed.jpg" = "Amaranthus_viridis_22052014.jpg"
    "weed_goosegrass.jpg" = "Eleusine_indica_01.jpg"
    "weed_common_purslane.jpg" = "Portulaca_oleracea.JPG"
}

# Conforming to Wikimedia's User-Agent policy
$userAgent = "WeedIntelBot/1.0 (https://weedintel.com; research-contact@weedintel.com)"

foreach ($fileName in $weeds.Keys) {
    $wikiName = $weeds[$fileName]
    $url = "https://commons.wikimedia.org/wiki/Special:FilePath/$wikiName"
    $outputPath = Join-Path -Path $PSScriptRoot -ChildPath $fileName
    
    # Skip if file already downloaded and has decent size
    if (Test-Path $outputPath) {
        $fileSize = (Get-Item $outputPath).Length
        if ($fileSize -gt 1000) {
            Write-Host "$fileName already exists and is healthy ($fileSize bytes). Skipping."
            continue
        }
    }
    
    Write-Host "Downloading $wikiName via Special:FilePath to $outputPath..."
    try {
        # Using a WebSession or simple Invoke-WebRequest with UserAgent and follow redirects
        $response = Invoke-WebRequest -Uri $url -OutFile $outputPath -UserAgent $userAgent -MaximumRedirection 5 -TimeoutSec 20
        Write-Host "Successfully downloaded $fileName."
        Start-Sleep -Milliseconds 700  # Avoid rate limiting
    } catch {
        $msg = $_.Exception.Message
        Write-Warning "Failed to download $fileName ($wikiName) : $msg"
    }
}
