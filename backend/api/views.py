from wkhtmltopdf.views import PDFTemplateResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pgmagick import Image, Geometry, Blob, Color, FilterTypes
import math
import base64


@api_view(['POST'])
def process_image(request):
    """
    Process an image to fit across multiple letter-sized sheets and return as PDF.
    
    Expected JSON body:
    {
        "sheets_horizontal": 2      # number of sheets horizontally
    }
    
    The view will automatically:
    - Detect if the image is landscape or portrait based on aspect ratio
    - Calculate the number of vertical sheets needed to maintain aspect ratio
    """
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
    
    # Load original image first to detect orientation
    file_bytes = uploaded_file.read()
    blob = Blob(file_bytes)
    img = Image(blob)
    
    # Get original dimensions
    size = img.size()
    orig_width = size.width()
    orig_height = size.height()
    
    # Auto-detect orientation based on image aspect ratio
    image_aspect_ratio = orig_width / float(orig_height)
    orientation = 'Landscape' if image_aspect_ratio > 1.0 else 'Portrait'
    
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
    
    # Recalculate total height to match exact sheet count
    total_height = PRINTABLE_HEIGHT_PX * sheets_vertical

    # Scale the image to fit
    new_width = total_width
    new_height = int(total_width / image_aspect_ratio)

    img.filterType(FilterTypes.PointFilter)
    
    # if new_height < total_height:
    #     new_height = total_height
    #     new_width = int(total_height * image_aspect_ratio)
    
    # Resize image
    img.scale(Geometry(new_width, new_height))
    img.density(Geometry(DPI, DPI))
    
    # Create canvas
    canvas_width = PRINTABLE_WIDTH_PX * sheets_horizontal
    canvas_height = PRINTABLE_HEIGHT_PX * sheets_vertical

    print(canvas_height, canvas_width)
    
    offset_x = (canvas_width - new_width) // 2
    offset_y = (canvas_height - new_height) // 2
    
    canvas = Image(Geometry(canvas_width, canvas_height), Color("white"))
    canvas.density(Geometry(DPI, DPI))
    canvas.composite(img, offset_x, offset_y)

    canvas.magick("JPEG")
    canvas.quality(85) 
    
    # Create image sections
    image_sections = []
    

    for row in range(sheets_vertical):
        for col in range(sheets_horizontal):
            # Calculate crop coordinates
            x = col * PRINTABLE_WIDTH_PX
            y = row * PRINTABLE_HEIGHT_PX
            
            # Create a copy and crop
            page_blob = Blob()
            canvas.write(page_blob)
            page_img = Image(page_blob)
            page_img.crop(Geometry(PRINTABLE_WIDTH_PX, PRINTABLE_HEIGHT_PX, x, y))
            
            # Convert to JPEG for embedding in HTML
            page_img.magick("JPEG")
            page_img.quality(85)
            output_blob = Blob()
            page_img.write(output_blob)
            
            # Convert to base64 for HTML embedding
            img_base64 = base64.b64encode(output_blob.data).decode('utf-8')
            image_sections.append(img_base64)
    
    print(len(image_sections))
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