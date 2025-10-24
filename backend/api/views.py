from wkhtmltopdf.views import PDFTemplateResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from PIL import Image, ImageOps
from io import BytesIO
import base64
import math


@api_view(['POST'])
def process_image(request):

    uploaded_file = request.FILES.get('image')
    if not uploaded_file:
        return Response({'error': 'No image uploaded'}, status=400)
    
    # Parse JSON data
    try:
        sheets_horizontal = int(request.data.get('sheets_horizontal', 1))
    except (ValueError, TypeError):
        return Response({'error': 'Invalid parameters'}, status=400)
    
    if sheets_horizontal < 1:
        return Response({'error': 'sheets_horizontal must be at least 1'}, status=400)
    
    # Load original image
    file_bytes = uploaded_file.read()
    img = Image.open(BytesIO(file_bytes))
    
    # Convert to RGB if necessary (handles transparency, CMYK, etc.)
    if img.mode not in ('RGB', 'L'):
        # Create white background
        if img.mode == 'RGBA' or 'transparency' in img.info:
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            else:
                background.paste(img)
            img = background
        else:
            img = img.convert('RGB')
    elif img.mode == 'L':
        img = img.convert('RGB')
    
    # Get original dimensions
    orig_width, orig_height = img.size
    print(f"Original image size: {orig_width}x{orig_height}, mode: {img.mode}")
    
    # Auto-detect orientation based on image aspect ratio
    image_aspect_ratio = orig_width / float(orig_height)
    orientation = 'Landscape' if image_aspect_ratio > 1.0 else 'Portrait'
    print(f"Orientation: {orientation}, aspect ratio: {image_aspect_ratio}")
    
    # Letter size dimensions
    DPI = 300
    LETTER_WIDTH_INCHES = 8.5
    LETTER_HEIGHT_INCHES = 11
    
    # Print safe area margins (0.25 inches on each side)
    MARGIN_INCHES = 0.25
    MARGIN_PX = int(MARGIN_INCHES * DPI)
    
    # Determine sheet dimensions based on detected orientation
    if orientation == 'Portrait':
        SHEET_WIDTH_INCHES = LETTER_WIDTH_INCHES
        SHEET_HEIGHT_INCHES = LETTER_HEIGHT_INCHES
    else:  # landscape
        SHEET_WIDTH_INCHES = LETTER_HEIGHT_INCHES
        SHEET_HEIGHT_INCHES = LETTER_WIDTH_INCHES
    
    SHEET_WIDTH_PX = int(SHEET_WIDTH_INCHES * DPI)
    SHEET_HEIGHT_PX = int(SHEET_HEIGHT_INCHES * DPI)
    
    # Printable area dimensions
    PRINTABLE_WIDTH_PX = SHEET_WIDTH_PX - (2 * MARGIN_PX)
    PRINTABLE_HEIGHT_PX = SHEET_HEIGHT_PX - (2 * MARGIN_PX)
    
    # Calculate the width in pixels for the given number of horizontal sheets
    total_width = PRINTABLE_WIDTH_PX * sheets_horizontal
    # Calculate the required height to maintain aspect ratio
    total_height = total_width / image_aspect_ratio
    # Calculate how many vertical sheets we need
    sheets_vertical = math.ceil(total_height / PRINTABLE_HEIGHT_PX)

    # Special constraint: if single page width requested, limit to 1 page height
    if sheets_horizontal == 1 and sheets_vertical > 1:
        sheets_vertical = 1
        total_height = PRINTABLE_HEIGHT_PX
        # Recalculate dimensions to fit in single page
        scale_by_width = PRINTABLE_WIDTH_PX / float(orig_width)
        scale_by_height = PRINTABLE_HEIGHT_PX / float(orig_height)
        scale_factor = min(scale_by_width, scale_by_height)
        new_width = int(orig_width * scale_factor)
        new_height = int(orig_height * scale_factor)
    elif sheets_horizontal == 1 and sheets_vertical == 1:
        # Also single page - fit within printable area
        total_height = PRINTABLE_HEIGHT_PX
        scale_by_width = PRINTABLE_WIDTH_PX / float(orig_width)
        scale_by_height = PRINTABLE_HEIGHT_PX / float(orig_height)
        scale_factor = min(scale_by_width, scale_by_height)
        new_width = int(orig_width * scale_factor)
        new_height = int(orig_height * scale_factor)
    else:
        # Recalculate total height to match exact sheet count
        total_height = PRINTABLE_HEIGHT_PX * sheets_vertical
        new_width = total_width
        new_height = int(total_width / image_aspect_ratio)

    # Scale the image to fit
    if sheets_horizontal == 1:
        # Single page width - use high quality scaling
        print(f"Single page mode: resizing to {new_width}x{new_height}")
        resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    else:
        # Multi-page - use nearest neighbor as per original code
        print(f"Multi-page mode: resizing to {new_width}x{new_height}")
        resized_img = img.resize((new_width, new_height), Image.Resampling.NEAREST)
    
    print(f"Resized image size: {resized_img.size}, mode: {resized_img.mode}")
    
    # Create canvas
    canvas_width = PRINTABLE_WIDTH_PX * sheets_horizontal
    canvas_height = PRINTABLE_HEIGHT_PX * sheets_vertical

    print(f"Canvas size: {canvas_width}x{canvas_height}")
    
    offset_x = (canvas_width - new_width) // 2
    offset_y = (canvas_height - new_height) // 2
    
    print(f"Paste offset: ({offset_x}, {offset_y})")
    
    # Create white canvas
    canvas = Image.new('RGB', (canvas_width, canvas_height), (255, 255, 255))
    # Paste the resized image onto canvas
    canvas.paste(resized_img, (offset_x, offset_y))
    
    print(f"Canvas after paste - size: {canvas.size}, mode: {canvas.mode}")
    
    # Debug: save canvas to check if image is there
    debug_buffer = BytesIO()
    canvas.save(debug_buffer, format='JPEG', quality=85)
    print(f"Canvas JPEG size: {len(debug_buffer.getvalue())} bytes")
    
    # Create image sections
    image_sections = []
    
    for row in range(sheets_vertical):
        for col in range(sheets_horizontal):
            # Calculate crop coordinates
            x = col * PRINTABLE_WIDTH_PX
            y = row * PRINTABLE_HEIGHT_PX
            
            # Crop the section
            page_img = canvas.crop((x, y, x + PRINTABLE_WIDTH_PX, y + PRINTABLE_HEIGHT_PX))
            
            # Convert to JPEG
            output_buffer = BytesIO()
            page_img.save(output_buffer, format='JPEG', quality=85, dpi=(DPI, DPI))
            
            # Convert to base64 for HTML embedding
            img_base64 = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
            image_sections.append(img_base64)
    
    # Prepare context for template
    context = {
        'image_sections': image_sections,
        'sheet_width': SHEET_WIDTH_INCHES,
        'sheet_height': SHEET_HEIGHT_INCHES,
        'margin': MARGIN_INCHES,
        'sheets_horizontal': sheets_horizontal,
        'sheets_vertical': sheets_vertical,
        'orientation': orientation,
    }
    
    template = 'multi_sheet_poster.html'
    # Create PDF response
    response = PDFTemplateResponse(
        request=request,
        template=template,
        filename=f'poster_{sheets_horizontal}x{sheets_vertical}_{orientation}.pdf',
        context=context,
        show_content_in_browser=False,
        cmd_options={
            'page-size': 'Letter',
            'dpi': DPI,
            'enable-local-file-access': True,
            'encoding': 'UTF-8',
            'orientation': f"{orientation}",
        }
    )
    
    # Add custom header
    
    return response