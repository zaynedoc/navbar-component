# Navbar Component for Razor Pages

Cool sidebar navigation component for Razor Pages projects.<br>
This repo discusses dependency-integration and some minor customizations regarding admin auth & layout integration.

## What's Included

```
NavBarComponent/
├── _Sidebar.cshtml          # Main sidebar navigation partial
├── _SocialIcons.cshtml      # Social icons component
├── navbar-styles.css        # All required CSS styles
├── navbar-script.js         # JavaScript for animations
└── README.md                # This file
```

## Installation

### 1. Copy Files

Copy the entire `NavBarComponent` folder to your Razor Pages project:
- Place `.cshtml` files in `Pages/Shared/`
- Place `.css` file in `wwwroot/css/`
- Place `.js` file in `wwwroot/js/`

### 2. Add Dependencies

#### Bootstrap Icons
Add to your `_Layout.cshtml` in the `<head>` section:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
```

#### CSS and JS
Add these references in `_Layout.cshtml`:

```html
<!-- In <head> -->
<link rel="stylesheet" href="~/css/navbar-styles.css" />

<!-- Before </body> -->
<script src="~/js/navbar-script.js"></script>
```

### 3. Update Your Layout

In your `_Layout.cshtml`, add the sidebar to your page structure:

```html
<body>
    <div class="layout-container">
        <aside class="sidebar">
            <partial name="_Sidebar" />
        </aside>
        
        <main class="main-content">
            @RenderBody()
        </main>
    </div>
</body>
```

### 4. Add Layout CSS

Add this to your main CSS file (e.g., `site.css`):

```css
.layout-container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    margin-left: var(--sidebar-width, 280px);
    flex: 1;
    padding: 2rem;
}
```

### Replace Logo

Replace the logo image path in `_Sidebar.cshtml`:

```razor
<img id="sidebarLogo" src="~/images/your-logo.png" alt="Logo" class="sidebar-logo" />
```

## 🔧 Configuration

### Admin Section

The admin section is shown only to signed-in admin users. To remove it, delete this section from `_Sidebar.cshtml`:

```razor
@if (SignInManager.IsSignedIn(User) && User.IsInRole("Admin"))
{
    ...
}
```

Add these CSS classes (already included in `navbar-styles.css`):

```css
body.sidebar-collapsed .sidebar {
    transform: translateX(-100%);
}

body.sidebar-collapsed .main-content {
    margin-left: 0;
}
```