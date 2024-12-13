import logging

logger = logging.getLogger(__name__)

class APISessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"Request path: {request.path}")
        logger.info(f"Session before: {request.session.items()}")
        
        if request.path.startswith('/api/'):
            request.session['api_session'] = True
        
        response = self.get_response(request)
        logger.info(f"Session after: {request.session.items()}")
        return response
