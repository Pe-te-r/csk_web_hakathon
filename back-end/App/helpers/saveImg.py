import requests
# Replace with your actual ImgBB API key
IMGDB_API_KEY = "76fd07e743624b8d8f03033d234f8f88"
IMGDB_UPLOAD_URL = f"https://api.imgbb.com/1/upload?key={IMGDB_API_KEY}" 
def get_img_url(image):
    files = {"image": (image.filename, image.stream, image.mimetype)}
    response = requests.post(IMGDB_UPLOAD_URL, files=files)
    if response.status_code != 200:
            return "Image upload failed", 500
    
    img_url = (
        response.json()["data"]["url"],
    )
    print(img_url)
    return img_url