import time
from functools import wraps
from typing import Callable


def timer(func: Callable):
    """ Return the approximate time a function takes """

    @wraps(func)
    def wrapper(*args, **kwargs):

        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()

        print(f"Elapsed time: {int((end_time - start_time) * 1000)} ms")

        return result

    return wrapper
