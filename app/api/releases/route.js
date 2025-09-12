import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/repos/apricopt/zorobrowsermanager/releases/latest', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GH_TOKEN}`,
        'User-Agent': 'Zoro-Browser-Manager-Web'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release = await response.json();
    
    // Parse and organize the assets
    const assets = release.assets || [];
    
    const organizedAssets = {
      windows: {
        exe: assets.find(asset => asset.name.includes('.exe') && !asset.name.includes('.blockmap')),
      },
      macos: {
        intel: assets.find(asset => asset.name.includes('.dmg') && !asset.name.includes('arm64') && !asset.name.includes('.blockmap')),
        appleSilicon: assets.find(asset => asset.name.includes('arm64.dmg') && !asset.name.includes('.blockmap')),
      },
      linux: {
        appimage: assets.find(asset => asset.name.includes('.AppImage')),
      }
    };

    const releaseData = {
      version: release.tag_name,
      name: release.name,
      publishedAt: release.published_at,
      body: release.body,
      htmlUrl: release.html_url,
      assets: organizedAssets,
      totalDownloads: assets.reduce((total, asset) => total + (asset.download_count || 0), 0)
    };

    return NextResponse.json(releaseData);
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    
    // Return fallback data
    return NextResponse.json({
      version: 'v1.0.8',
      name: 'Latest Release',
      publishedAt: new Date().toISOString(),
      body: 'Latest version of Zoro Browser Manager',
      htmlUrl: 'https://github.com/apricopt/zorobrowsermanager/releases',
      assets: {
        windows: {
          exe: {
            name: 'Zoro-Browser-Manager-Setup-1.0.8.exe',
            browser_download_url: '#',
            size: 87.3 * 1024 * 1024 // 87.3 MB in bytes
          }
        },
        macos: {
          intel: {
            name: 'Zoro-Browser-Manager-1.0.8.dmg',
            browser_download_url: '#',
            size: 266 * 1024 * 1024 // 266 MB in bytes
          },
          appleSilicon: {
            name: 'Zoro-Browser-Manager-1.0.8-arm64.dmg',
            browser_download_url: '#',
            size: 261 * 1024 * 1024 // 261 MB in bytes
          }
        },
        linux: {
          appimage: {
            name: 'Zoro-Browser-Manager-1.0.8.AppImage',
            browser_download_url: '#',
            size: 114 * 1024 * 1024 // 114 MB in bytes
          }
        }
      },
      totalDownloads: 0,
      error: true
    }, { status: 200 });
  }
}